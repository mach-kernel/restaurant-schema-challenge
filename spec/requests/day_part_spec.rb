# frozen_string_literal: true
describe 'CRUD Day Part Resource', type: :request do
  let(:brand) { ::Brand.create(name: 'brand') }
  let!(:location) { ::Location.create(name: 'test', brand: brand) }

  context 'create and update' do
    it 'inserts a new record on POST' do
      post '/v1/day_part', name: 'dinner', location_id: location.id

      expect(response.code).to eql '201'
      parsed_response = JSON.parse(response.body)
      expect do
        ::DayPart.find(extract_rel(parsed_response)['href'].split('/').last)
      end.to_not raise_error
    end

    it 'raises error if location not specified' do
      post '/v1/day_part', name: 'test_day_part'
      expect(response.code).to eql '400'
    end

    context 'update a record on PUT' do
      let!(:new_location) { ::Location.create(name: 'other', brand: brand) }
      let!(:day_part) { ::DayPart.create(name: 'abc', location: location) }

      it 'updates an existing record if there is new info' do
        put "/v1/day_part/#{day_part.id}", location_id: new_location.id

        expect(response.code).to eql '204'
        day_part.reload
        expect(day_part.location).to eql new_location
      end

      it 'does nothing with the same data' do
        cached_name = day_part.name
        put "/v1/day_part/#{day_part.id}", name: cached_name

        expect(response.code).to eql '304'
        day_part.reload
        expect(day_part.name).to eql cached_name
      end
    end
  end

  context 'retrieve' do
    let!(:day_parts) do
      (0..9).to_a.map do |x|
        ::DayPart.create(name: "ot #{x}", location: location)
      end
    end

    it 'retrieves the day_part by id' do
      get "/v1/day_part/#{day_parts.first.id}"
      expect(response.code).to eql '200'
    end

    it 'retrieves all day parts when no ID is provided' do
      get '/v1/day_part/'
      expect(response.code).to eql '200'
      expect(
        extract_rel(JSON.parse(response.body), 'resources')['href'].count
      ).to eql 10
    end
  end

  context 'delete' do
    let(:brand) { ::Brand.create(name: 'a858') }
    let(:location) { Location.create(name: 'contoso ltd', brand: brand) }
    let(:day_part) { ::DayPart.create(name: 'test', location: location)}

    it 'nukes the record' do
      delete "/v1/day_part/#{day_part.id}"
      
      expect(response.code).to eql '204'
      expect(response.body).to be_empty
      expect { DayPart.find(day_part.id) }.to raise_error
    end
  end
end
