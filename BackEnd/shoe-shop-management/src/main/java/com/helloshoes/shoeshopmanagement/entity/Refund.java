package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refund")
public class Refund implements SuperEntity {
    @Id
    private String refundCode;
    private String description;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "employee_code")
    private Employee employee;

    @ManyToMany(mappedBy = "refunds")
    private List<Item> items;
}
