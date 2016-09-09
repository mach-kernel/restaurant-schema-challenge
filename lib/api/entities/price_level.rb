# frozen_string_literal: true
module API
  module Entities
    module PriceLevel
      include Base

      property :amount
      property :location_name

      %i(order_type menu_item day_part).each do |sideload|
        link sideload do |opts|
          Entities.format_link(opts, represented, sideload.to_s.classify)
        end
      end
    end
  end
end
