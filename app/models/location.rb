# frozen_string_literal: true
class Location
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String

  %i(day_parts order_types).each { |m| has_many m }
  belongs_to :brand

  validates :order_types, presence: true
end
