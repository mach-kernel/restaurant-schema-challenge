# frozen_string_literal: true
class OrderType
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
end
