# frozen_string_literal: true
module API
  module Entities
    module List
      include Roar::JSON
      include Roar::Hypermedia
      include Grape::Roar::Representer

      link :self do |opts|
        Entities.request_url(opts[:env])
      end

      link :resources do |opts|
        represented.pluck(:id).map do |id|
          Entities.format_link(
            opts, OpenStruct.new(id: id), represented.klass.name
          )
        end
      end
    end
  end
end
