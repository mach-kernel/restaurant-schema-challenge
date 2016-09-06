# frozen_string_literal: true
describe API::Helpers::Query do
  subject do
    Object
      .include(described_class)
      .tap do |obj|
        obj.instance_eval do
          def error!(*_args)
            false
          end
        end
      end
  end

  before do
    allow(subject).to receive(:error!).and_return false
  end

  context '#find_or_raise' do
    let(:brand) { ::Brand.create(name: 'query test') }

    it 'finds the record by given fields' do
      expect(subject.find_or_raise(::Brand, brand.id)).to eql brand
    end

    it 'does not find records with invalid query' do
      expect(subject.find_or_raise(::Brand, 'foobar')).to eql false
    end
  end

  context '#create_or_raise' do
    it 'creates a model with valid fields' do
      expect(subject.create_or_raise(::Brand, name: 'bar')).to be_a(::Brand)
    end

    it 'does not create with invalid fields' do
      expect(subject.create_or_raise(::Brand, gggg: 'ggGggW')).to eql false
    end
  end

  context '#remove_or_raise' do
    let(:brand) { ::Brand.create(name: 'query test') }

    it 'nukes the record' do 
      expect(subject.remove_or_raise(::Brand, brand.id)).to_not eql false
      expect { Brand.find(brand.id) }
        .to raise_error Mongoid::Errors::DocumentNotFound
    end
  end
end
