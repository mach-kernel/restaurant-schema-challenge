# frozen_string_literal: true
describe 'CRUD Location Resource', type: :request do
  context 'create and update' do
    let(:brand) { ::Brand.create(name: 'funny string') }

    it 'inserts a new record on POST' do
      post '/v1/location', name: 'test_location', brand_id: brand.id

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        Location.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    it 'raises error if brand not specified' do
      post '/v1/location', name: 'test_location'
      expect(response.code).to eql '400'
    end

    context 'update a record on PUT' do
      let!(:old_brand) { ::Brand.create(name: 'abc') }
      let!(:location) { ::Location.create(name: 'def', brand: old_brand) }
      let!(:new_brand) { ::Brand.create(name: 'xyz') }

      it 'updates an existing record if there is new info' do
        put "/v1/location/#{location.id}", brand_id: new_brand.id

        expect(response.code).to eql '204'
        location.reload
        expect(location.brand).to eql(new_brand)
      end

      it 'does nothing with the same data' do
        cached_name = location.name
        put "/v1/location/#{location.id}", name: cached_name

        expect(response.code).to eql '304'
        location.reload
        expect(location.name).to eql cached_name
      end
    end
  end

  context 'retrieve' do
    let(:brand) { ::Brand.create(name: 'a858') }
    let!(:locations) do
      (0..9).to_a.map { |x| ::Location.create(name: "l#{x}", brand: brand) }
    end

    let!(:order_type) do
      ::OrderType.create(name: 'carrier pigeon', location: locations.first)
    end

    let!(:day_part) do
      ::DayPart.create(name: 'post brunch brunch', location: locations.first)
    end

    it 'retrieves the location with sideloaded resources if present' do
      get "/v1/location/#{locations.first.id}"
      expect(response.code).to eql '200'
      expect(JSON.parse(response.body)['order_types'].count).to eql 1
      expect(JSON.parse(response.body)['day_parts'].count).to eql 1
    end

    it 'retrieves all locations when no ID is provided' do
      get '/v1/location/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end
  end

  context 'delete' do
    let(:brand) { ::Brand.create(name: 'a858') }
    let!(:location) { Location.create(name: 'contoso ltd', brand: brand) }

    it 'nukes the record' do
      delete "/v1/location/#{location.id}"

      expect(response.code).to eql '204'
      expect(response.body).to be_empty
      expect { Location.find(location.id) }.to raise_error
    end
  end
end
