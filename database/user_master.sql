-- ============================================================
-- User Master Table Schema
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                      INT UNSIGNED  NOT NULL AUTO_INCREMENT,

  -- Basic credentials
  `user_name`               VARCHAR(100)  NOT NULL,
  `password`                VARCHAR(255)  NOT NULL,          -- bcrypt hash
  `branch`                  VARCHAR(100)  NOT NULL,

  -- Profile
  `title`                   ENUM('Mr','Mrs','Ms','Dr') NOT NULL DEFAULT 'Mr',
  `display_name`            VARCHAR(150)  NOT NULL,
  `sex`                     ENUM('Male','Female','Other') NOT NULL DEFAULT 'Male',
  `designation`             VARCHAR(100)  NOT NULL,

  -- Rights (checkboxes)
  `right_admin`             TINYINT(1)    NOT NULL DEFAULT 0,
  `right_marketing`         TINYINT(1)    NOT NULL DEFAULT 0,
  `right_accounts`          TINYINT(1)    NOT NULL DEFAULT 0,
  `right_quotation`         TINYINT(1)    NOT NULL DEFAULT 0,
  `right_hr`                TINYINT(1)    NOT NULL DEFAULT 0,
  `right_management`        TINYINT(1)    NOT NULL DEFAULT 0,
  `right_documentation`     TINYINT(1)    NOT NULL DEFAULT 0,
  `right_settings`          TINYINT(1)    NOT NULL DEFAULT 0,

  -- Job Status (checkboxes)
  `job_created`             TINYINT(1)    NOT NULL DEFAULT 0,
  `job_process`             TINYINT(1)    NOT NULL DEFAULT 0,
  `job_process_completed`   TINYINT(1)    NOT NULL DEFAULT 0,
  `job_closed`              TINYINT(1)    NOT NULL DEFAULT 0,
  `job_cancelled`           TINYINT(1)    NOT NULL DEFAULT 0,
  `job_re_opened`           TINYINT(1)    NOT NULL DEFAULT 0,

  -- Voucher Status (checkboxes)
  `voucher_created`         TINYINT(1)    NOT NULL DEFAULT 0,
  `voucher_approved`        TINYINT(1)    NOT NULL DEFAULT 0,
  `voucher_confirmed`       TINYINT(1)    NOT NULL DEFAULT 0,
  `voucher_cancelled`       TINYINT(1)    NOT NULL DEFAULT 0,
  `voucher_dispute`         TINYINT(1)    NOT NULL DEFAULT 0,

  `status`                  ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at`              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_branch`      (`branch`),
  INDEX `idx_designation` (`designation`),
  INDEX `idx_status`      (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Sample seed data
-- ============================================================
INSERT INTO `users` (
  `user_name`, `password`, `branch`, `title`, `display_name`, `sex`, `designation`,
  `right_admin`, `right_marketing`, `right_accounts`, `right_quotation`,
  `right_hr`, `right_management`, `right_documentation`, `right_settings`,
  `job_created`, `job_process`, `job_process_completed`, `job_closed`, `job_cancelled`, `job_re_opened`,
  `voucher_created`, `voucher_approved`, `voucher_confirmed`, `voucher_cancelled`, `voucher_dispute`,
  `status`
) VALUES
(
  'John Admin', '$2b$10$placeholder_hash_1', 'Head Office', 'Mr', 'John A.', 'Male', 'System Administrator',
  1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,
  1,1,1,1,1,
  'Active'
),
(
  'Sara Manager', '$2b$10$placeholder_hash_2', 'Mumbai Branch', 'Ms', 'Sara M.', 'Female', 'Operations Manager',
  0,1,1,1,0,1,1,0,
  1,1,1,0,0,0,
  1,1,0,0,0,
  'Active'
),
(
  'Tom Ops', '$2b$10$placeholder_hash_3', 'Delhi Branch', 'Mr', 'Tom O.', 'Male', 'Operator',
  0,0,0,1,0,0,1,0,
  1,1,0,0,0,0,
  1,0,0,0,0,
  'Inactive'
);
