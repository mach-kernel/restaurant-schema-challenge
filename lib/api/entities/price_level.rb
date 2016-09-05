# frozen_string_literal: true
module API
  module Entities
    module PriceLevel
      include Base

      property :order_type
      property :menu_item
      property :day_part
    end
  end
end
