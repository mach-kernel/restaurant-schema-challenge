# frozen_string_literal: true
module API
  module Entities
    extend ActiveSupport::Autoload
    autoload :Brand

    def self.request(opts)
      Grape::Request.new(opts[:env])
    end
  end
end
