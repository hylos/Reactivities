using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain;

public class Activity
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }

    public bool IsCancelled { get; set; }

    /*
     * when we create an activity in the app, the activity won't have ActivityAttendees as well as Comments. 
     * so with that regard the API might throw an error to say Activity Attendees and Comments are null
     * The work around that is initialize the list with new empty object so that we don't get null referrence error.
     */

    //we are initiaziling the list so that it does  send object referrence null when creating an activty. since Attendees will empty.
    public ICollection<ActivityAttendee> Attendees { get; set;} = new List<ActivityAttendee>();


    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
