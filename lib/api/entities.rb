# frozen_string_literal: true
module API
  module Entities
    extend ActiveSupport::Autoload
    autoload :Brand
    autoload :DayPart
    autoload :List
    autoload :Location
    autoload :OrderType

    def self.path_klass(url)
      url.match(%r{(\/[a-z_]*)$|(\/[a-z_]*\/[a-z0-9]*)$})
         .try(:captures)
         .try(:select, &:present?)
         .try(:first)
    end

    def self.request_url(env_opts)
      Grape::Request.new(env_opts).url
    end

    # rubocop:disable Lint/AssignmentInCondition
    def self.parse_url(req_url)
      unless resource_path = path_klass(req_url)
        req_url = req_url.split('/')
        req_url.pop
        resource_path = path_klass(req_url = req_url.join('/'))
      end
      [req_url, resource_path]
    end
    # rubocop:enable Lint/AssignmentInCondition

    def self.format_link(opts, represented, klass)
      req_url, resource_path = parse_url(request_url(opts[:env]))
      klass = klass.underscore.downcase

      # If we 'sideload' an entity we can't use this 'request url'
      # 'hack' to generate the link for self
      req_url = "#{req_url.split(resource_path).first}/#{klass}" unless
        resource_path.include?(klass)

      # If the resource class is at the end of the URL, append the
      # represented's ID if we have it (e.g on a PUT)
      if (/#{klass}$/ =~ req_url) && represented.try(:id).present?
        "#{req_url}/#{represented.id}"
      else
        req_url
      end
    end
  end
end
