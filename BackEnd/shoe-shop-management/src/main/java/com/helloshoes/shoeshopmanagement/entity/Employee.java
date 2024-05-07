package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import com.helloshoes.shoeshopmanagement.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employee")
public class Employee implements SuperEntity {
    @Id
    private String employeeCode;
    private String employeeName;
    @Column(columnDefinition = "LONGTEXT")
    private String profilePic;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String status;
    private String designation;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Date dob;
    private Date joinedDate;
    private String branch;
    private String addressNo;
    private String addressLane;
    private String addressCity;
    private String addressState;
    private String postalCode;
    private String contactNumber;
    @Column(unique = true)
    private String email;
    private String password;
    private String emergencyContactPerson;
    private String emergencyContactNumber;

    @OneToMany(mappedBy = "employee")
    private List<Sales> sales;

    @OneToMany(mappedBy = "employee")
    private List<Refund> refund;
}