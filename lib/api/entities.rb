# frozen_string_literal: true
module API
  module Entities
    extend ActiveSupport::Autoload
    autoload :Brand
    autoload :Location
    autoload :List

    def self.format_link(opts, represented, klass, return_raw_url = false)
      request_url = Grape::Request.new(opts[:env]).url
      return request_url if return_raw_url
      
      resource_path = request_url
        .match(/(\/[a-z]*)$|(\/[a-z]*\/[a-z0-9]*)$/)
        .captures
        .select(&:present?)
        .first

      # If we 'sideload' an entity we can't use this 'request url'
      # 'hack' to generate the link for self
      if not resource_path.include?(klass.downcase)
        request_url = 
          "#{request_url.split(resource_path).first}/#{klass.downcase}"
      end

      # If the resource class is at the end of the URL, append the
      # represented's ID if we have it (e.g on a PUT)
      if (/#{klass.downcase}$/ =~ request_url) && represented.try(:id).present?
        "#{request_url}/#{represented.id}"
      else
        request_url
      end
    end
  end
end
