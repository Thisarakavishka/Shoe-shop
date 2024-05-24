package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.helloshoes.shoeshopmanagement.entity.enums.PaymentMethod;
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
@Table(name = "sales")
public class Sales implements SuperEntity{
    @Id
    private String saleCode;
    private Double totalPrice;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private Integer addedPoints;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "employee_code")
    @JsonBackReference
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "customer_code")
    @JsonBackReference
    private Customer customer;

    @ManyToMany(mappedBy = "sales",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Item> items;
}
