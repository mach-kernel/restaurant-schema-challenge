# frozen_string_literal: true
Rails.application.routes.draw do
  mount API::Root => '/v1/'

  get '/web', to: 'web#index'

  %w(
    brand
    location
    order_type
    day_part
    menu_item
    price_level
  ).each { |route| get "/web/#{route}" }
end
