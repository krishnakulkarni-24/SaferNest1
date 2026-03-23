CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    status VARCHAR(30) NOT NULL,
    reported_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    location VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL
);

CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    resource_id UUID NOT NULL REFERENCES resources(id),
    status VARCHAR(30) NOT NULL
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(id),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(30) NOT NULL
);

CREATE INDEX idx_incidents_reported_by ON incidents(reported_by);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_resource_id ON requests(resource_id);
CREATE INDEX idx_tasks_incident_id ON tasks(incident_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
