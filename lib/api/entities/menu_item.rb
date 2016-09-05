# frozen_string_literal: true
module API
  module Entities
    module MenuItem
      include Base

      collection :price_levels, extend: Entities::PriceLevel

      link :brand do |opts|
        Entities.format_link(opts, represented, 'Brand')
      end
    end
  end
end
