var PriceLevelRow = React.createClass({

  propTypes: {
    entity: React.PropTypes.object,
    notifyParent: React.PropTypes.func
  },

  getInitialState: function() {
    name_parts = this.props.entity.name.split(',');
    order_type = name_parts.pop();
    day_part = (name_parts.length > 1) ? name_parts.pop() : undefined;

    return {
      entity: this.props.entity,
      order_type: order_type,
      day_part: day_part
    };
  },

  delete: function() {
    $.ajax({
      method: 'delete',
      url: this.state.entity.links[0].href
    });

    this.props.notifyParent(this.state.entity.links[0].href);
    this.setState({entity: undefined});
  },

  render: function() {
    if (this.state.entity !== undefined) {
      return(
        <tr>
          <td>
            {this.state.entity.location_name}
          </td>
          <td>
            {this.state.entity.amount}
          </td>
          <td>
            {this.state.order_type}
          </td>
          <td>
            {this.state.day_part === undefined ? 'n/a' : this.state.day_part}
          </td>
          <td>
            <OverlayTrigger
              overlay={
                <Tooltip id="modal-tooltip">
                  You <strong>cannot</strong> undo this.
                </Tooltip>
              }
              placement="top"
            >
              <Button
                onClick={this.delete}
                bsStyle="danger"
                bsSize="xs"
              >Delete</Button>
            </OverlayTrigger>  
          </td>
        </tr>
      );
    } else { return null; }
  }
});
