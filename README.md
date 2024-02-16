![Logo](./docs/gh.png)

# kCall

An open-source meeting service where you can host meetings, collaborate with others, and communicate
effectively, all within a user-friendly environment.

## Features
- **Video conferencing**: high-quality video calls with multiple participants simultaneously.
- **Audio-only mode**: seamlessly switch to audio-only mode for situations with limited bandwidth.
- **Screen sharing**: share your screen with others.
- **Chat**: engage in text-based conversations during meetings for quick exchanges and side discussions.
- **Excerpts**: tag messages and receive them in document format at the end of the meeting.
- **Organizations**: group into organizations and access collaborative work.
- **Calendar**: schedule meetings for participants in calendar.
- **One-time rooms**: host or join rooms without authorization.

## Requirements
- NodeJS >= 18
- PNPM >= 8
- Postgres server

## Getting started
To get started follow these steps:
1. Clone the repo:
   ```shell
   git clone https://github.com/Samsonium/kCall.git
   ```
2. Install dependencies:
   ```shell
   cd kCall
   pnpm install
   ```
3. Run the application:
   ```bash
   pnpm start:dev
   ```
   or
   ```bash
   pnpm build
   pnpm start:prod
   ```

## Documentation
Currently, documentation is under development. This section will update later.

## Contributing
I welcome contributors from the open-source community to help improve and expand kCall. If you're interested in
contributing, please follow guidelines below.

### With your idea or bugfix
1. Fork the repo and create new branch for your feature or bugfix.
2. Ensure your code follows the established coding standards and conventions.
3. Write clear and concise commit messages.
4. Submit a pull request, providing a list or explanation of the changes made and any relevant information.

### With project tasks
If you're interested in contributing but have no idea for improvement or bugfix, you can use task from
[project linked to this repository](https://github.com/users/Samsonium/projects/5) and follow these guidelines:

1. Fork the repo and create new branch named by task id.
2. Ensure your code follows the established coding standards and conventions.
3. Write clear and concise commit messages using this format: `(#<task>): <brief description>`.
4. Submit a pull request, providing a explanation of your implementation and any relevant information.

## Feedback and support
If you encounter any issues, have suggestions for improvement, or require assistance, please don't hesitate to
reach out. You can report bugs, submit feature requests, or ask for help by opening an issue on the GitHub repository.

Thank you for choosing kCall for your meeting needs. I hope you enjoy using this service!
