# frozen_string_literal: true
class PriceLevel
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
end
