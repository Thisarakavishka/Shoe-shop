package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.CustomerLevel;
import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer implements SuperEntity {
    private String customerCode;
    private String customerName;
    private Gender gender;
    private Date joinedDate;
    private CustomerLevel customerLevel;
}
