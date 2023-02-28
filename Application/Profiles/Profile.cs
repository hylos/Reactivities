using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public string Image { get; set; }

        //Following - when user is logged in we want to find out if they're currently following the other user when they're return their profile.
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }

        public ICollection<Photo> Photos { get; set; }
    }
}
