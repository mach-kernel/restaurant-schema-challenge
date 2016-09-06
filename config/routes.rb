# frozen_string_literal: true
Rails.application.routes.draw do
  mount API::Root => '/v1/'

  get '/web', to: 'web#index'
end
