# frozen_string_literal: true
class Location
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  belongs_to :brand

  %i(day_parts order_types).each { |m| has_many m, dependent: :destroy }
  validates :order_types, presence: true
end
