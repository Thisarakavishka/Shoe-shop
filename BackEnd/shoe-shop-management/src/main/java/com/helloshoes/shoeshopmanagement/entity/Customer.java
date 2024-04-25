package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.CustomerLevel;
import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer")
public class Customer implements SuperEntity {
    @Id
    private String customerCode;
    private String customerName;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private Date joinedDate;
    @Enumerated(EnumType.STRING)
    private CustomerLevel customerLevel;
    private Integer totalPoints;
    private Date dob;
    private String addressNo;
    private String addressLane;
    private String addressCity;
    private String addressState;
    private String postalCode;
    private String contactNumber;
    private String email;
    private Timestamp RecentPurchaseDateTime;
}
