# frozen_string_literal: true
module API
  module Helpers
    module DayPart
      def day_part_params
        params do
          optional :name, type: String, desc: 'Day Part name'
          optional :id, type: String, desc: 'Day Part ID'
          optional :location_id, type: String, desc: 'ID of Location Parent'
        end
      end
    end
  end
end
