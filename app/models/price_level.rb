# frozen_string_literal: true
class PriceLevel
  include Mongoid::Document
  include Mongoid::Timestamps

  # I don't see the reason to include a
  # name field, sorry.
  def name
    parts = [
      menu_item.name,
      try(:day_part).try(:name),
      order_type.name
    ].compact

    "Price for #{parts.join(', ')}"
  end

  field :amount, type: String

  belongs_to :menu_item
  belongs_to :day_part
  belongs_to :order_type

  validates :menu_item, presence: true
  validates :order_type, presence: true

  index({ order_type: 1, day_part: -1 }, unique: true)
end
