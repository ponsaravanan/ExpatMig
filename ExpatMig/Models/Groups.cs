﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ExpatMig.Models
{
    public class Group
    {
        //public Groups()
        //{
        //    //MyThreads = new HashSet<Threads>();
        //}

        [Key, Column(Order = 0)]
        public int GroupID { get; set; }
        [MaxLength(250)]
        public String Description { get; set; }
        [MaxLength(100)]
        public String Slug { get; set; }
        public bool IsActive { get; set; }
        public int SeqNo { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<Thread> MyThreads { get; set; }


    }
}