# frozen_string_literal: true
module API
  class Root < Grape::API
    format :json
    formatter :json, Grape::Formatter::Roar

    mount Resources::Brand => '/brand'
    mount Resources::DayPart => '/day_part'
    mount Resources::Location => '/location'
    mount Resources::OrderType => '/order_type'
  end
end
