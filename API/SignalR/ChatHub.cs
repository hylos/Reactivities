using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        //two methods 1. send a comment 2....
        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            //we want to return the comment to anyone who's connected to the hub including the owner of the post.
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComments", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            //the query string needs to match with activityId when we pass it from the client.
            var activityId = httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}
