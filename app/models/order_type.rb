# frozen_string_literal: true
class OrderType
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  has_many :price_levels, dependent: :destroy
  belongs_to :location
end
