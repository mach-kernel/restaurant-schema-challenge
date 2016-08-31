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
                          .retrieve_pricing(partial_pricing.order_type)

      expect(retrieved_pricing).to eql(partial_pricing)

      expect(retrieved_pricing.order_type).to eql(
        locations.first.order_types.last
      )
    end

    it 'prices correctly for location + order type + day part' do
      expect(menu_items
              .first
              .price_levels
              .retrieve_pricing(full_pricing.order_type, full_pricing.day_part))
        .to eql(full_pricing)
    end
  end
end
