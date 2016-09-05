# frozen_string_literal: true
module API
  module Helpers
    module MenuItem
      def menu_item_params
        params do
          optional :name, type: String, desc: 'Menu Item name'
          optional :id, type: String, desc: 'Menu Item ID'
          optional :brand_id, type: String, desc: 'ID of Brand Parent'
        end
      end
    end
  end
end
