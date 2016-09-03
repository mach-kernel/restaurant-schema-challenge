# frozen_string_literal: true
describe 'CRUD Brand Resource', type: :request do
  context 'create and update' do
    it 'inserts a new record on POST' do
      post '/v1/brand', name: 'test_brand'

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        Brand.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    context 'update a record on PUT' do
      let!(:brand) { Brand.create(name: 'contoso ltd') }

      it 'updates an existing record if there is new info' do
        put "/v1/brand/#{brand.id}", name: 'better contoso ltd'

        expect(response.code).to eql '204'
        brand.reload
        expect(brand.name).to eql 'better contoso ltd'
      end

      it 'does nothing with the same data' do
        cached_name = brand.name
        put "/v1/brand/#{brand.id}", name: cached_name

        expect(response.code).to eql '304'
        brand.reload
        expect(brand.name).to eql cached_name
      end
    end
  end

  context 'retrieve' do
    let!(:brands) do
      (0..9).to_a.map { |x| Brand.create(name: "Brand #{x}") } 
    end

    let!(:location) do
      Location.create(
        name: 'running out of wit',
        brand: brands.first,
        order_types: [OrderType.create(name: 'less wit here too')]
      )
    end

    it 'retrieves the brand with sideloaded resources if present' do
      get "/v1/brand/#{brands.first.id}"
      expect(response.code).to eql '200'
      expect(JSON.parse(response.body)['locations'].count).to eql 1
    end

    it 'retrieves all brands when no ID is provided' do
      get '/v1/brand/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end
  end
end
