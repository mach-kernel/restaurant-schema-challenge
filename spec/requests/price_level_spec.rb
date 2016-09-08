# frozen_string_literal: true
describe 'CRUD Price Level Resource', type: :request do
  let(:brand) { ::Brand.create(name: 'brand') }
  let!(:location) { ::Location.create(name: 'test', brand: brand) }
  let!(:order_type) { ::OrderType.create(name: 'sit in', location: location) }
  let!(:day_part) { ::DayPart.create(name: 'morning', location: location) }
  let!(:menu_item) { ::MenuItem.create(name: 'omelette', brand: brand) }

  context 'create and update' do
    it 'inserts a new record on POST' do
      post(
        '/v1/price_level',
        menu_item_id: menu_item.id,
        order_type_id: order_type.id,
        amount: 49.99
      )

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        ::PriceLevel.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    it 'raises error if order type and menu item not specified' do
      post '/v1/price_level', amount: 59.99
      expect(response.code).to eql '400'
    end

    it 'raises error if you try to insert a duplicate price' do
      post(
        '/v1/price_level',
        menu_item_id: menu_item.id,
        order_type_id: order_type.id,
        amount: 49.99
      )
      post(
        '/v1/price_level',
        menu_item_id: menu_item.id,
        order_type_id: order_type.id,
        amount: 49.99
      )
      expect(response.code).to eql '400'
    end

    context 'update a record on PUT' do
      let(:price_level) do
        ::PriceLevel.create(
          amount: 2,
          order_type: order_type,
          menu_item: menu_item
        )
      end

      it 'updates an existing record if there is new info' do
        put "/v1/price_level/#{price_level.id}", day_part_id: day_part.id
        expect(response.code).to eql '204'
        price_level.reload
        expect(price_level.day_part).to eql day_part
      end

      it 'does nothing with the same data' do
        cached_name = price_level.name
        put "/v1/price_level/#{price_level.id}", name: cached_name
        expect(response.code).to eql '304'
      end
    end
  end

  context 'retrieve' do
    let!(:price_levels) do
      (0..9).to_a.map do |x|
        ::PriceLevel.create(
          day_part: ::DayPart.create(name: "dp #{x}", location: location),
          order_type: ::OrderType.create(name: "ot #{x}", location: location),
          menu_item: menu_item
        )
      end
    end

    it 'retrieves sideloaded resources if present' do
      get "/v1/price_level/#{price_levels.first.id}"
      expect(response.code).to eql '200'
      %w(day_part order_type menu_item).each do |field|
        expect(extract_rel(JSON.parse(response.body), field))
          .to have_key('href')
      end
    end

    it 'retrieves all Price Levels when no ID is provided' do
      get '/v1/price_level/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end
  end

  context 'delete' do
    let!(:price_level) do 
      ::PriceLevel.create(
        day_part: ::DayPart.create(name: "dp", location: location),
        order_type: ::OrderType.create(name: "ot", location: location),
        menu_item: menu_item
      )
    end

    it 'nukes the record' do
      delete "/v1/price_level/#{price_level.id}"

      expect(response.code).to eql '204'
      expect(response.body).to be_empty
      expect { PriceLevel.find(price_level.id) }.to raise_error
    end
  end
end
