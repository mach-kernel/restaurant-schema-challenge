# frozen_string_literal: true
module API
  module Entities
    extend ActiveSupport::Autoload
    autoload :Brand
    autoload :Location
    autoload :List

    def self.path_klass(url)
      url.match(%r{(\/[a-z]*)$|(\/[a-z]*\/[a-z0-9]*)$})
         .captures
         .select(&:present?)
         .first
    end

    def self.request_url(env_opts)
      Grape::Request.new(env_opts).url
    end

    def self.format_link(opts, represented, klass)
      req_url = request_url(opts[:env])
      resource_path = path_klass(req_url)

      # If we 'sideload' an entity we can't use this 'request url'
      # 'hack' to generate the link for self
      unless resource_path.include?(klass.downcase)
        req_url = "#{req_url.split(resource_path).first}/#{klass.downcase}"
      end

      # If the resource class is at the end of the URL, append the
      # represented's ID if we have it (e.g on a PUT)
      if (/#{klass.downcase}$/ =~ req_url) && represented.try(:id).present?
        "#{req_url}/#{represented.id}"
      else
        req_url
      end
    end
  end
end
