# frozen_string_literal: true
describe 'CRUD Order Type Resource', type: :request do
  let(:brand) { ::Brand.create(name: 'brand') }
  let!(:location) { ::Location.create(name: 'test', brand: brand) }

  context 'create and update' do
    it 'inserts a new record on POST' do
      post '/v1/order_type', name: 'delivery', location_id: location.id

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        ::OrderType.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    it 'raises error if location not specified' do
      post '/v1/order_type', name: 'test_order_type'
      expect(response.code).to eql '400'
    end

    context 'update a record on PUT' do
      let!(:new_location) { ::Location.create(name: 'other', brand: brand) }
      let!(:order_type) { ::OrderType.create(name: 'abc', location: location) }

      it 'updates an existing record if there is new info' do
        put "/v1/order_type/#{order_type.id}", location_id: new_location.id

        expect(response.code).to eql '204'
        order_type.reload
        expect(order_type.location).to eql new_location
      end

      it 'does nothing with the same data' do
        cached_name = order_type.name
        put "/v1/order_type/#{order_type.id}", name: cached_name

        expect(response.code).to eql '304'
        order_type.reload
        expect(order_type.name).to eql cached_name
      end
    end
  end

  context 'retrieve' do
    let!(:order_types) do
      (0..9).to_a.map do |x|
        ::OrderType.create(name: "ot #{x}", location: location)
      end
    end

    it 'retrieves all order types when no ID is provided' do
      get '/v1/order_type/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end
  end
end
