using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        //below property willl help here but we don't want to return it to the client. so we will name it JsonIgnore

        [JsonIgnore]
        public string HostUsername { get; set; }
    }
}
