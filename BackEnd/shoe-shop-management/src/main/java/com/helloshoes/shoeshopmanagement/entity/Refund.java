package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference
    private Employee employee;

    @ManyToMany
    @JoinTable(name = "item_refund",
            joinColumns = @JoinColumn(name = "refund_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id"))
    @JsonManagedReference
    private List<Item> items;
}
