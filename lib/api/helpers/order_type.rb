# frozen_string_literal: true
module API
  module Helpers
    module OrderType
      def order_type_params
        params do
          optional :name, type: String, desc: 'Order Type name'
          optional :id, type: String, desc: 'Order Type ID'
          optional :location_id, type: String, desc: 'ID of Location Parent'
        end
      end
    end
  end
end
