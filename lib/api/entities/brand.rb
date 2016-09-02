# frozen_string_literal: true
module API
  module Entities
    module Brand
      include Roar::JSON
      include Roar::Hypermedia
      include Grape::Roar::Representer

      property :name

      link :self do |opts|
        "#{Entities.request(opts).url}/#{represented.id}"
      end
    end
  end
end
