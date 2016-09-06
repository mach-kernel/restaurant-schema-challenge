# frozen_string_literal: true
module API
  module Entities
    module DayPart
      include Base

      link :location do |opts|
        Entities.format_link(opts, represented, 'Location')
      end
    end
  end
end
