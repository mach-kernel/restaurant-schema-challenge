# frozen_string_literal: true
require 'rails_helper'

describe 'document relationships' do
  # TODO: ideally tests for each model
  # and probably use factorygirl like a normal person

  let(:brand) { Brand.create(name: 'xyz restaurant group') }
  let(:locations) do
    %i(nyc la miami).map { |l| Location.create(name: "xyz #{l}", brand: brand) }
  end

  # Every location does online and sit-in
  before do
    locations.each do |l|
      %w(online sit-in).each { |t| OrderType.create(name: t, location: l) }
    end
  end

  let(:menu_items) do
    [
      MenuItem.create(name: 'alphabet soup', brand: brand),
      MenuItem.create(name: 'burek', brand: brand)
    ]
  end

  context 'pricing levels' do
    let(:full_pricing) do
      PriceLevel.create(
        amount: 15,
        menu_item: menu_items.first,
        order_type: locations.first.order_types.first,
        day_part: DayPart.create(name: 'brunch', location: locations.first)
      )
    end

    let(:partial_pricing) do
      PriceLevel.create(
        amount: 49,
        menu_item: menu_items.last,
        order_type: locations.first.order_types.last
      )
    end

    it 'prices correctly for location + order type' do
      retrieved_pricing = menu_items
                          .last
                          .price_levels
                          .retrieve_pricing(
                            order_type_id: partial_pricing.order_type.id
                          )

      expect(retrieved_pricing).to eql(partial_pricing)

      expect(retrieved_pricing.order_type).to eql(
        locations.first.order_types.last
      )

      expect(retrieved_pricing.name)
        .to eql(
          "Price for #{menu_items.last.name}, "\
          "#{partial_pricing.order_type.name}"
        )
    end

    it 'prices correctly for location + order type + day part' do
      expect(menu_items
              .first
              .price_levels
              .retrieve_pricing(
                order_type_id: full_pricing.order_type.id,
                day_part_id: full_pricing.day_part.id
              )).to eql(full_pricing)
    end
  end

  context 'cascading deletions' do
    let(:error_class) { Mongoid::Errors::DocumentNotFound }
    context 'menu items' do
      let!(:pricing_id) do
        PriceLevel.create(
          amount: 10,
          menu_item: menu_items.last,
          order_type: locations.first.order_types.last
        ).id
      end

      it 'removes pricings with menu items' do
        menu_items.last.destroy!
        expect { PriceLevel.find(pricing_id) }.to raise_error(error_class)
      end
    end

    context 'locations' do
      let!(:day_part_id) do
        DayPart.create(name: 'a', location: locations.last).id
      end

      let!(:order_type_id) do
        OrderType.create(name: 'rfc1149', location: locations.last).id
      end

      it 'removes day parts and order types with locations' do
        locations.last.destroy!
        expect { DayPart.find(day_part_id) }.to raise_error(error_class)
        expect { OrderType.find(order_type_id) }.to raise_error(error_class)
      end
    end

    context 'brands' do
      let!(:brand) { Brand.create(name: 'ultra cool brand') }
      let!(:location_id) do
        Location.create(name: 'some location', brand: brand)
      end
      let!(:menu_item_id) do
        MenuItem.create(name: 'expensive leaf', brand: brand)
      end

      it 'removes locations and menu items' do
        brand.destroy!
        expect { Location.find(location_id) }.to raise_error(error_class)
        expect { MenuItem.find(menu_item_id) }.to raise_error(error_class)
      end
    end
  end
end
