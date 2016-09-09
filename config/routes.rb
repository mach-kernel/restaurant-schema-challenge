# frozen_string_literal: true
Rails.application.routes.draw do
  mount API::Root => '/v1/'

  get '/web', to: 'web#index'

  get '/web/brand'
  get '/web/brand/:id/locations', to: 'web#locations'
  get '/web/brand/:id/menu_items', to: 'web#menu_items'
end
