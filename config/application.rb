# frozen_string_literal: true
require File.expand_path('../boot', __FILE__)

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'sprockets/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SalidoPlatformChallenge
  class Application < Rails::Application
    require 'roar/representer'
    require 'roar/json'
    require 'roar/json/hal'

    config.autoload_paths << "#{Rails.root}/lib"
  end
end
