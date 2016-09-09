var DayPartOrderTypeRow = React.createClass({

  propTypes: {
    entity: React.PropTypes.object,
    notifyParent: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      entity: this.props.entity
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
            {this.state.entity.name}
          </td>
          <td>
            <OverlayTrigger
              overlay={
                <Tooltip id="modal-tooltip">
                  You <strong>cannot</strong> undo this.
                  If a price level is dependent on this resource,
                  it will also be removed.
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
