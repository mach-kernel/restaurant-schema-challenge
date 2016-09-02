# frozen_string_literal: true
describe 'CRUD Brand Resource', type: :request do
  context 'create and update' do
    it 'inserts a new record on POST' do
      post '/v1/brand', name: 'test_brand'

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)

      expect do
        Brand.find(extract_self(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    context 'update a record on PUT' do
      let!(:brand) { Brand.create(name: 'contoso ltd') }

      before { brand.reload }

      it 'updates an existing record if there is new info' do
        put "/v1/brand/#{brand.id}", name: 'better contoso ltd'

        expect(response.code).to eql '204'
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
end
