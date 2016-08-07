﻿using ExpatMig.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ExpatMig.ViewModels
{
    public class UserProfileViewModel
    {
        [Key]
        public int UserProfileID { get; set; }


        public String Nick { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String PhoneNumber { get; set; }
        [DisplayFormat(DataFormatString = "{0:dd-MMM-yy}", ApplyFormatInEditMode = true)]
        public DateTime? BirthDay { get; set; }
        public int NativeCityID { get; set; }
        public int? MigratingToID { get; set; }
        public double? Experience { get; set; }
        public String Sector { get; set; }
        public String LinkedIn { get; set; }
        public String VisaType { get; set; }
        [DisplayFormat(DataFormatString = "{0:dd-MMM-yy}", ApplyFormatInEditMode = true)]
        public DateTime? VisaGrantOn { get; set; }
        public string Suburb { get; set; }
        
        public virtual ICollection<TravelLog> MyTravels { get; set; }

        [ForeignKey("NativeCityID")]
        public virtual City NativeCity { get; set; }

        [ForeignKey("MigratingToID")]
        public virtual City MigratingTo { get; set; }
    }
}