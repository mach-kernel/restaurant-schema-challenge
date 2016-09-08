# frozen_string_literal: true
describe 'CRUD Menu Item Resource', type: :request do
  let(:brand) { ::Brand.create(name: 'brand') }

  context 'create and update' do
    it 'inserts a new record on POST' do
      post '/v1/menu_item', name: 'liver', brand_id: brand.id

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        ::MenuItem.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    it 'raises error if brand not specified' do
      post '/v1/menu_item', name: 'a nice chianti'
      expect(response.code).to eql '400'
    end

    context 'update a record on PUT' do
      let!(:new_brand) { ::Brand.create(name: 'other') }
      let!(:menu_item) { ::MenuItem.create(name: 'abc', brand: brand) }

      it 'updates an existing record if there is new info' do
        put "/v1/menu_item/#{menu_item.id}", brand_id: new_brand.id

        expect(response.code).to eql '204'
        menu_item.reload
        expect(menu_item.brand).to eql new_brand
      end

      it 'does nothing with the same data' do
        cached_name = menu_item.name
        put "/v1/menu_item/#{menu_item.id}", name: cached_name

        expect(response.code).to eql '304'
        menu_item.reload
        expect(menu_item.name).to eql cached_name
      end
    end
  end

  context 'retrieve' do
    let!(:menu_items) do
      (0..9).to_a.map do |x|
        ::MenuItem.create(name: "mi #{x}", brand: brand)
      end
    end

    it 'retrieves the menu_item by id' do
      get "/v1/menu_item/#{menu_items.first.id}"
      expect(response.code).to eql '200'
    end

    it 'retrieves all Menu Items when no ID is provided' do
      get '/v1/menu_item/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end

    context 'price' do
      let!(:location1) { ::Location.create(name: 'test1', brand: brand) }
      let!(:day_part1) { ::DayPart.create(name: 'dp1', location: location1) }
      let!(:order_type1) { ::OrderType.create(name: 'o1', location: location1) }

      let!(:price) do
        ::PriceLevel.create(
          amount: 50,
          order_type: order_type1,
          day_part: day_part1,
          menu_item: menu_items.last
        )
      end

      it 'retrieves the correct pricing for the given context' do
        get(
          "/v1/menu_item/#{menu_items.last.id}/price",
          day_part_id: day_part1.id,
          order_type_id: order_type1.id
        )
        expect(JSON.parse(response.body)['amount']).to eql '50'
      end
    end
  end

  context 'delete' do
    let!(:menu_item) { ::MenuItem.create(name: 'test', brand: brand)}

    it 'nukes the record' do
      delete "/v1/menu_item/#{menu_item.id}"

      expect(response.code).to eql '204'
      expect(response.body).to be_empty
      expect { MenuItem.find(menu_item.id) }.to raise_error
    end
  end
end
