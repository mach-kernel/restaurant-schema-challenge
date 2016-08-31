# frozen_string_literal: true
class PriceLevel
  include Mongoid::Document
  include Mongoid::Timestamps

  # I don't see the reason to include a
  # name field, sorry.

  field :amount, type: String

  belongs_to :menu_item
  belongs_to :day_part
  belongs_to :order_type
  index({ order_type: 1, day_part: -1 }, unique: true)

  # has_and_belongs_to_many :day_part, inverse_of: nil
  # has_and_belongs_to_many :order_type, inverse_of: nil
end
