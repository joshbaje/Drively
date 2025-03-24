-- Seed data for cancellation policies
INSERT INTO cancellation_policies (
    name,
    description,
    hours_before_full_refund,
    hours_before_partial_refund,
    partial_refund_percentage,
    is_active
) VALUES (
    'Standard Cancellation',
    'Standard cancellation policy with graduated refunds',
    72,
    24,
    50,
    true
);

INSERT INTO cancellation_policies (
    name,
    description,
    hours_before_full_refund,
    hours_before_partial_refund,
    partial_refund_percentage,
    is_active
) VALUES (
    'Flexible Cancellation',
    'More flexible cancellation policy with longer timeframes',
    48,
    12,
    75,
    true
);

INSERT INTO cancellation_policies (
    name,
    description,
    hours_before_full_refund,
    hours_before_partial_refund,
    partial_refund_percentage,
    is_active
) VALUES (
    'Strict Cancellation',
    'Strict cancellation policy with shorter timeframes',
    96,
    48,
    25,
    true
);
