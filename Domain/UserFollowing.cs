using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollowing
    {
        //a person who will follow another user.
        public string ObserverId { get; set; }
        public AppUser Observer { get; set; }


        //user to be followed.
        public string TargetId { get; set; }
        public AppUser Target { get; set; }
    }
}
