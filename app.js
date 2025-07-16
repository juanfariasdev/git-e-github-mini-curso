// Presentation controller
class GitPresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 54;
        this.isFullscreen = false;

        // Module configuration
        this.modules = [
            { id: 1, title: "📚 Introdução e Revisão", slides: [1, 2, 3, 4, 5, 6] },
            { id: 2, title: "🤝 Fundamentos Colaborativos", slides: [7, 8, 9, 10, 11, 12] },
            { id: 3, title: "🌳 Estratégias de Branching", slides: [13, 14, 15, 16, 17, 18, 19, 20] },
            { id: 4, title: "🔄 Pull Requests", slides: [21, 22, 23, 24, 25, 26, 27, 28] },
            { id: 5, title: "⚔️ Resolução de Conflitos", slides: [29, 30, 31, 32, 33, 34, 35] },
            { id: 6, title: "📊 Organização e Gestão", slides: [36, 37, 38, 39, 40, 41, 42] },
            { id: 7, title: "⭐ Boas Práticas", slides: [43, 44, 45, 46, 47, 48, 49, 50, 51] },
            { id: 8, title: "📝 Slides Extras", slides: [52, 53, 54] }
        ];

        this.init();
        this.goToSlide(1);
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.generateMissingSlides();
    }

    bindEvents() {
        // Navigation buttons - FIX: Ensure correct button behavior
        document.getElementById('prev-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousSlide();
        });
        document.getElementById('next-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSlide();
        });
        document.getElementById('fullscreen-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));


        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'Space':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'f':
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (this.isFullscreen) {
                    this.exitFullscreen();
                }
                break;
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        const currentSlideElement = document.querySelector('.slide.active');
        const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);

        if (!newSlideElement) return;

        const direction = slideNumber > this.currentSlide ? 'right' : 'left';

        // Remove active class from current slide
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            currentSlideElement.classList.add(direction === 'right' ? 'prev' : 'next');
        }

        // Add active class to new slide
        newSlideElement.classList.remove('prev', 'next');
        newSlideElement.classList.add('active');

        // Add animation class
        newSlideElement.classList.add(`entering-${direction}`);

        // Remove animation class after transition
        setTimeout(() => {
            newSlideElement.classList.remove(`entering-${direction}`);
        }, 400);

        this.currentSlide = slideNumber;
        this.updateUI();
    }

    updateUI() {
        // Update slide counter
        document.getElementById('current-slide').textContent = this.currentSlide;
        document.getElementById('total-slides').textContent = this.totalSlides;

        // Update progress bar
        const progress = (this.currentSlide / this.totalSlides) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // Update module indicator
        const currentModule = this.getCurrentModule();
        document.getElementById('module-indicator').textContent = currentModule.title;

        // Update navigation buttons
        document.getElementById('prev-btn').disabled = this.currentSlide === 1;
        document.getElementById('next-btn').disabled = this.currentSlide === this.totalSlides;
    }

    getCurrentModule() {
        for (const module of this.modules) {
            if (module.slides.includes(this.currentSlide)) {
                return module;
            }
        }
        return this.modules[0]; // fallback
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        document.body.classList.add('fullscreen');
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        document.body.classList.remove('fullscreen');
    }

    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);

        if (!this.isFullscreen) {
            document.body.classList.remove('fullscreen');
        }
    }

    generateMissingSlides() {
        const container = document.getElementById('slide-container');
        const existingSlides = container.querySelectorAll('.slide').length;

        if (existingSlides >= this.totalSlides) return;

        // Generate missing slides with placeholder content
        for (let i = existingSlides + 1; i <= this.totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.setAttribute('data-slide', i);

            const content = this.generateSlideContent(i);
            slide.innerHTML = content;

            container.appendChild(slide);
        }
    }

    generateSlideContent(slideNumber) {
        const slideData = this.getSlideData(slideNumber);

        return `
            <div class="slide-content">
                <h2>${slideData.title}</h2>
                <div class="slide-body">
                    ${slideData.content}
                </div>
            </div>
        `;
    }

    getSlideData(slideNumber) {
        const slideMap = {
            1: {
                title: "🎯 Mini Curso Git e GitHub",
                content: `
            <h3>para Trabalho em Equipe</h3>
            <div class="course-details">
            <p><strong>Duração:</strong> 3 horas e 30 minutos</p>
            <p><strong>Horário:</strong> 13:15 - 17:00</p>
            <p><strong>Foco:</strong> Colaboração e trabalho em equipe</p>
            </div>
            <div class="git-logos">
            <div class="git-logo">Git</div>
            <div class="github-logo">GitHub</div>
            </div>
            `
            },
            2: {
                title: "📅 Agenda do Curso",
                content: `
            <div class="schedule">
            <div class="schedule-item">
                <span class="time">13:15 - 13:35</span>
                <span class="module">📚 Introdução e Revisão</span>
                <span class="duration">20 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">13:35 - 14:15</span>
                <span class="module">🤝 Fundamentos Colaborativos</span>
                <span class="duration">40 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">14:15 - 15:05</span>
                <span class="module">🌳 Estratégias de Branching</span>
                <span class="duration">50 min</span>
            </div>
            <div class="schedule-item break">
                <span class="time">15:05 - 15:20</span>
                <span class="module">☕ INTERVALO</span>
                <span class="duration">15 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">15:20 - 16:05</span>
                <span class="module">🔄 Pull Requests e Code Review</span>
                <span class="duration">45 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">16:05 - 16:35</span>
                <span class="module">⚔️ Resolução de Conflitos</span>
                <span class="duration">30 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">16:35 - 16:50</span>
                <span class="module">📊 Organização e Gestão</span>
                <span class="duration">15 min</span>
            </div>
            <div class="schedule-item">
                <span class="time">16:50 - 17:00</span>
                <span class="module">⭐ Boas Práticas</span>
                <span class="duration">10 min</span>
            </div>
            </div>
            `
            },
            3: {
                title: "🚫 Problemas Comuns em Equipes",
                content: `
            <div class="problems-grid">
            <div class="problem-item">
                <h3>🔄 Conflitos Constantes</h3>
                <p>Alterações simultâneas no mesmo arquivo geram conflitos difíceis de resolver</p>
            </div>
            <div class="problem-item">
                <h3>📚 Histórico Confuso</h3>
                <p>Commits desorganizados e mensagens pouco descritivas</p>
            </div>
            <div class="problem-item">
                <h3>🏗️ Falta de Padronização</h3>
                <p>Cada desenvolvedor usa um fluxo diferente de trabalho</p>
            </div>
            <div class="problem-item">
                <h3>🔍 Dificuldade de Review</h3>
                <p>Pull requests extensos e difíceis de revisar</p>
            </div>
            <div class="problem-item">
                <h3>🚀 Deploy Arriscado</h3>
                <p>Medo de fazer deploy por falta de confiança no código</p>
            </div>
            <div class="problem-item">
                <h3>📱 Comunicação Falha</h3>
                <p>Falta de rastreabilidade entre tarefas e código</p>
            </div>
            </div>
            `
            },
            4: {
                title: "🆚 Git × GitHub",
                content: `
            <div class="comparison">
            <section class="comparison-item">
                <h3>🔧 Git (Local)</h3>
                <ul>
                <li>Sistema de controle de versão distribuído</li>
                <li>Funciona offline</li>
                <li>Gerencia histórico de commits e branches</li>
                <li>Executado via linha de comando ou IDE</li>
                <li>Armazena tudo na sua máquina</li>
                </ul>
                </section>
                <section class="comparison-item">
                <h3>🌐 GitHub (Remoto)</h3>
                <ul>
                <li>Plataforma de hospedagem de repositórios Git</li>
                <li>Interface web para Pull Requests e Code Review</li>
                <li>Ferramentas de Issues, Projects e Actions</li>
                <li>Colaboração e compartilhamento em nuvem</li>
                <li>Integra com CI/CD e automações</li>
                </ul>
            </section>
            </div>
            `
            },

            5: {
                title: "⚡ Comandos Básicos – Revisão",
                content: `
        <div style="display: grid; gap: 20px;">

            <section class="command-block">
            <h3>1. Configuração Inicial (uma única vez)</h3>
            <pre><code class="language-bash">
        git config --global user.name  "Seu Nome"   # identifica autor dos commits
        git config --global user.email "seu@email.com"</code></pre>
            </section>

            <section class="command-block">
            <h3>2. Criar ou Clonar Repositório</h3>
            <pre><code class="language-bash">
        git init                          # transforma pasta em repositório
        git clone &lt;url&gt;                   # baixa cópia existente</code></pre>
            </section>

            <section class="command-block">
            <h3>3. Fluxo Diário</h3>
            <pre><code class="language-bash">
        git add &lt;arquivo&gt;                 # envia arquivo à staging area
        git commit -m "feat: mensagem"    # salva snapshot
        git push origin main              # envia ao GitHub</code></pre>
            </section>

            <section class="command-block">
            <h3>4. Acompanhar Estado</h3>
            <pre><code class="language-bash">
        git status                        # arquivos modificados
        git log --oneline                 # histórico resumido
        git diff                          # diferenças não commitadas</code></pre>
            </section>

        </div>
        `
            },
            6: {
                title: "🎯 Exercício Prático 1",
                content: `
            <div class="exercise">
            <h3>Verificação de Ambiente (10 minutos)</h3>
            <div class="checklist">
            <label><input type="checkbox"> git config --global user.name "Seu Nome"</label>
            <label><input type="checkbox"> git config --global user.email "seu@email.com"</label>
            <label><input type="checkbox"> Criar pasta e executar git init</label>
            <label><input type="checkbox"> Testar git status para ver repositório vazio</label>
            <label><input type="checkbox"> Criar arquivo exemplo.txt</label>
            <label><input type="checkbox"> git add exemplo.txt</label>
            <label><input type="checkbox"> git commit -m "feat: adicionar arquivo exemplo"</label>
            <label><input type="checkbox"> git log --oneline para ver histórico</label>
            </div>
            <div class="exercise-commands">
            <h4>Comandos para verificação:</h4>
            <pre><code>
        git --version
        git config --list
        mkdir projeto-teste
        cd projeto-teste
        git init
        git status
        echo "Meu primeiro projeto" > exemplo.txt
        git add exemplo.txt
        git commit -m "feat: adicionar arquivo exemplo"
        git log --oneline
        </code></pre>
            </div>
            </div>
            `
            },
            7: {
                title: "🤝 Conceitos de Colaboração",
                content: `
                <div class="collaboration-flow">
                <div class="flow-item">
                    <h3>📦 Repositório Distribuído</h3>
                    <p>Cada desenvolvedor tem uma cópia completa do projeto</p>
                    <p>Trabalho independente e offline</p>
                    <p>Sincronização quando necessário</p>
                </div>
                <div class="flow-item">
                    <h3>🔄 Fluxo Básico</h3>
                    <ol>
                    <li>Clone do repositório</li>
                    <li>Criação de branch</li>
                    <li>Desenvolvimento</li>
                    <li>Commit das mudanças</li>
                    <li>Push da branch</li>
                    <li>Pull Request</li>
                    <li>Review e merge</li>
                    </ol>
                </div>
                </div>
            `
            },
            8: {
                title: "🌐 Repositórios Remotos",
                content: `
                <div class="remote-concepts">
                <div class="concept">
                    <h3>🎯 Origin</h3>
                    <p>Repositório remoto padrão (seu fork)</p>
                    <pre><code>git remote add origin https://github.com/seu-usuario/repo.git</code></pre>
                </div>
                <div class="concept">
                    <h3>⬆️ Upstream</h3>
                    <p>Repositório original (projeto principal)</p>
                    <pre><code>git remote add upstream https://github.com/projeto-original/repo.git</code></pre>
                </div>
                <div class="concept">
                    <h3>📋 Comandos Úteis</h3>
                    <pre><code>
            git remote -v                    # Listar remotes
            git remote add upstream <url>    # Adicionar remote
            git remote set-url origin <url>  # Alterar URL
                    </code></pre>
                </div>
                </div>
            `
            },
            9: {
                title: "🍴 Clone vs Fork",
                content: `
                <div class="clone-fork-comparison">
                <div class="comparison-item">
                    <h3>📥 Clone</h3>
                    <ul>
                    <li>Cópia local do repositório</li>
                    <li>Acesso direto (se tiver permissão)</li>
                    <li>Ideal para projetos próprios</li>
                    <li>Push direto para o repositório</li>
                    </ul>
                    <pre><code>git clone https://github.com/user/repo.git</code></pre>
                </div>
                <div class="comparison-item">
                    <h3>🍴 Fork</h3>
                    <ul>
                    <li>Cópia do repositório na sua conta</li>
                    <li>Independente do original</li>
                    <li>Ideal para contribuições</li>
                    <li>Pull Request para o original</li>
                    </ul>
                    <pre><code># Após fork no GitHub
    git clone https://github.com/seu-usuario/repo.git
    git remote add upstream https://github.com/original/repo.git</code></pre>
                </div>
                </div>
            `
            },
            10: {
                title: "🔑 Configuração SSH",
                content: `
                <div class="ssh-setup">
                <h3>1. Gerar Chave SSH</h3>
                <pre><code>ssh-keygen -t ed25519 -C "seu@email.com"</code></pre>
                <h3>2. Adicionar ao SSH Agent</h3>
                <pre><code>eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519</code></pre>
                <h3>3. Copiar Chave Pública</h3>
                <pre><code>cat ~/.ssh/id_ed25519.pub</code></pre>
                <h3>4. Testar Conexão</h3>
                <pre><code>ssh -T git@github.com</code></pre>
                </div>
            `
            },
            11: {
                title: "🔐 Gestão de Credenciais",
                content: `
                    <div class="credential-management">
                        <h3>Tokens de Acesso Pessoal</h3>
                        <div class="concept">
                            <h4>Criando Token no GitHub</h4>
                            <ol>
                                <li>Settings → Developer settings → Personal access tokens</li>
                                <li>Generate new token (classic)</li>
                                <li>Selecionar scopes necessários</li>
                                <li>Copiar token (única vez)</li>
                            </ol>
                        </div>
                        <div class="concept">
                            <h4>Configurando Git</h4>
                            <pre><code>git config --global credential.helper store
git push origin main
# Digite username e token como password</code></pre>
                        </div>
                    </div>
                `
            },
            12: {
                title: "🎯 Exercício Prático 2",
                content: `
                    <div class="exercise">
                        <h3>Configuração Segura (15 minutos)</h3>
                        <div class="checklist">
                            <label><input type="checkbox"> Configurar chave SSH</label>
                            <label><input type="checkbox"> Adicionar ao GitHub</label>
                            <label><input type="checkbox"> Testar conexão SSH</label>
                            <label><input type="checkbox"> Clonar repositório com SSH</label>
                            <label><input type="checkbox"> Configurar upstream (se necessário)</label>
                        </div>
                    </div>
                `
            },
            13: {
                title: "🌟 Benefícios de Usar Branches",
                content: `
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <h3>🔒 Isolamento</h3>
                            <p>Desenvolvimento independente sem afetar o código principal</p>
                        </div>
                        <div class="benefit-item">
                            <h3>🔄 Paralelismo</h3>
                            <p>Múltiplas features sendo desenvolvidas simultaneamente</p>
                        </div>
                        <div class="benefit-item">
                            <h3>🧪 Experimentação</h3>
                            <p>Teste de novas ideias sem riscos</p>
                        </div>
                        <div class="benefit-item">
                            <h3>📝 Rastreabilidade</h3>
                            <p>Histórico claro de cada feature ou correção</p>
                        </div>
                    </div>
                `
            },
            14: {
                title: "🌊 Git Flow vs GitHub Flow",
                content: `
                    <div class="flow-comparison">
                        <div class="flow-item">
                            <h3>Git Flow</h3>
                            <ul>
                                <li>Múltiplas branches permanentes</li>
                                <li>develop, feature, release, hotfix</li>
                                <li>Mais complexo</li>
                                <li>Ideal para releases programados</li>
                                <img class="img-300" src="img/14-gitflow.png" alt=""/>
                            </ul>
                        </div>
                        <div class="flow-item">
                            <h3>GitHub Flow</h3>
                            <ul>
                                <li>Apenas main + feature branches</li>
                                <li>Mais simples</li>
                                <li>Deploy contínuo</li>
                                <li>Ideal para desenvolvimento ágil</li>
                                <img class="img-300" src="img/14-githubflow.png" alt=""/>
                            </ul>
                        </div>
                    </div>
                `
            },
            15: {
                title: "📋 GitHub Flow Recomendado",
                content: `
                    <div class="github-flow">
                        <h3>Fluxo em 6 Passos</h3>
                        <ol class="flow-steps">
                            <li><strong>Criar branch</strong> - A partir da main</li>
                            <li><strong>Fazer commits</strong> - Pequenos e frequentes</li>
                            <li><strong>Abrir Pull Request</strong> - Cedo para discussão</li>
                            <li><strong>Revisar código</strong> - Colaboração da equipe</li>
                            <li><strong>Fazer merge</strong> - Após aprovação</li>
                            <li><strong>Deletar branch</strong> - Limpar após merge</li>
                        </ol>
                    </div>
                `
            }
        };

        // Continue with more slides...
        const defaultSlides = {
            16: { title: "🎮 Comandos de Gerenciamento", content: this.getBranchCommandsContent() },
            17: { title: "📝 Convenções de Nomenclatura", content: this.getNamingConventionsContent() },
            18: { title: "🛡️ Proteção de Branches", content: this.getBranchProtectionContent() },
            19: { title: "🔄 Sincronização de Branches", content: this.getBranchSyncContent() },
            20: { title: "🎯 Exercício Prático 3", content: this.getExercise3Content() },
            21: { title: "🔄 O que é Pull Request", content: this.getPullRequestIntroContent() },
            22: { title: "🔍 Anatomia de um PR", content: this.getPRAnatomyContent() },
            23: { title: "✍️ Criando PRs Efetivos", content: this.getEffectivePRContent() },
            24: { title: "👥 Processo de Code Review", content: this.getCodeReviewContent() },
            25: { title: "⭐ Boas Práticas de Review", content: this.getReviewBestPracticesContent() },
            26: { title: "💬 Tipos de Comentários", content: this.getCommentTypesContent() },
            27: { title: "🔀 Estratégias de Merge", content: this.getMergeStrategiesContent() },
            28: { title: "🎯 Exercício Prático 4", content: this.getExercise4Content() },
            29: { title: "⚡ Entendendo Conflitos", content: this.getConflictIntroContent() },
            30: { title: "🔍 Identificando Conflitos", content: this.getIdentifyConflictsContent() },
            31: { title: "🚧 Marcadores de Conflito", content: this.getConflictMarkersContent() },
            32: { title: "🛠️ Ferramentas de Resolução", content: this.getResolutionToolsContent() },
            33: { title: "🎯 Estratégias de Resolução", content: this.getResolutionStrategiesContent() },
            34: { title: "🛡️ Prevenção de Conflitos", content: this.getConflictPreventionContent() },
            35: { title: "🎯 Exercício Prático 5", content: this.getExercise5Content() },
            36: { title: "🐛 GitHub Issues", content: this.getIssuesContent() },
            37: { title: "📋 Templates de Issues", content: this.getIssueTemplatesContent() },
            38: { title: "🏷️ Sistema de Labels", content: this.getLabelsContent() },
            39: { title: "📊 GitHub Projects", content: this.getProjectsContent() },
            40: { title: "🎯 Milestones", content: this.getMilestonesContent() },
            41: { title: "🔗 Linking Issues e PRs", content: this.getLinkingContent() },
            42: { title: "🎯 Exercício Prático 6", content: this.getExercise6Content() },
            43: { title: "📝 Commits Semânticos", content: this.getSemanticCommitsContent() },
            44: { title: "💡 Exemplos de Commits", content: this.getCommitExamplesContent() },
            45: { title: "🔄 Workflow Completo", content: this.getCompleteWorkflowContent() },
            46: { title: "🤖 GitHub Actions", content: this.getActionsContent() },
            47: { title: "📊 Métricas e Monitoramento", content: this.getMetricsContent() },
            48: { title: "📚 Recursos para Aprendizado", content: this.getLearningResourcesContent() },
            49: { title: "🚀 Próximos Passos", content: this.getNextStepsContent() },
            50: { title: "📋 Resumo Final", content: this.getFinalSummaryContent() }
        };

        return slideMap[slideNumber] || defaultSlides[slideNumber] || {
            title: `Slide ${slideNumber}`,
            content: `<p>Conteúdo do slide ${slideNumber}</p>`
        };
    }

    getBranchCommandsContent() {
        return `
            <div class="commands-grid">
                <div class="command-block">
                    <h3>Criar e Trocar</h3>
                    <pre><code>git checkout -b feature/nova-funcionalidade
git switch -c feature/nova-funcionalidade</code></pre>
                </div>
                <div class="command-block">
                    <h3>Listar Branches</h3>
                    <pre><code>git branch
git branch -a
git branch -r</code></pre>
                </div>
                <div class="command-block">
                    <h3>Deletar Branch</h3>
                    <pre><code>git branch -d feature/concluida
git push origin --delete feature/concluida</code></pre>
                </div>
                <div class="command-block">
                    <h3>Renomear Branch</h3>
                    <pre><code>git branch -m novo-nome
git push origin -u novo-nome</code></pre>
                </div>
            </div>
        `;
    }

    getNamingConventionsContent() {
        return `
            <div class="naming-conventions">
                <h3>Padrões Recomendados</h3>
                <div class="convention-examples">
                    <div class="convention-item">
                        <h4>🆕 Features</h4>
                        <code>feature/adicionar-autenticacao</code>
                        <code>feature/JIRA-123-user-profile</code>
                    </div>
                    <div class="convention-item">
                        <h4>🐛 Bugfixes</h4>
                        <code>bugfix/corrigir-login</code>
                        <code>fix/header-responsivo</code>
                    </div>
                    <div class="convention-item">
                        <h4>🚑 Hotfixes</h4>
                        <code>hotfix/security-patch</code>
                        <code>hotfix/critical-bug</code>
                    </div>
                    <div class="convention-item">
                        <h4>📚 Documentação</h4>
                        <code>docs/atualizar-readme</code>
                        <code>docs/api-documentation</code>
                    </div>
                </div>
            </div>
        `;
    }

    getBranchProtectionContent() {
        return `
            <div class="branch-protection">
                <h3>Configurações de Proteção</h3>
                <div class="protection-rules">
                    <div class="rule-item">
                        <h4>✅ Require pull request reviews</h4>
                        <p>Obrigatório ter aprovação antes do merge</p>
                    </div>
                    <div class="rule-item">
                        <h4>✅ Require status checks</h4>
                        <p>Testes devem passar antes do merge</p>
                    </div>
                    <div class="rule-item">
                        <h4>✅ Require branches to be up to date</h4>
                        <p>Branch deve estar atualizada com main</p>
                    </div>
                    <div class="rule-item">
                        <h4>✅ Restrict pushes</h4>
                        <p>Apenas administradores podem fazer push direto</p>
                    </div>
                </div>
            </div>
        `;
    }

    getBranchSyncContent() {
        return `
            <div class="sync-commands">
                <h3>Mantendo Branches Sincronizadas</h3>
                <div class="command-block">
                    <h4>Atualizar Main Local</h4>
                    <pre><code>git checkout main
git pull upstream main</code></pre>
                </div>
                <div class="command-block">
                    <h4>Atualizar Feature Branch</h4>
                    <pre><code>git checkout feature/minha-branch
git rebase main</code></pre>
                </div>
                <div class="command-block">
                    <h4>Resolver Conflitos no Rebase</h4>
                    <pre><code>git add .
git rebase --continue</code></pre>
                </div>
            </div>
        `;
    }

    getExercise3Content() {
        return `
            <div class="exercise">
                <h3>Workflow de Branches (20 minutos)</h3>
                <div class="checklist">
                    <label><input type="checkbox"> Criar branch feature/adicionar-readme</label>
                    <label><input type="checkbox"> Adicionar arquivo README.md</label>
                    <label><input type="checkbox"> Commit das mudanças</label>
                    <label><input type="checkbox"> Push da branch</label>
                    <label><input type="checkbox"> Criar Pull Request</label>
                    <label><input type="checkbox"> Simular review e merge</label>
                </div>
            </div>
        `;
    }

    getPullRequestIntroContent() {
        return `
            <div class="pr-intro">
                <h3>Definição</h3>
                <p>Pull Request é uma proposta de mudança no código que permite revisão e discussão antes da integração.</p>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <h4>🔍 Code Review</h4>
                        <p>Revisão colaborativa do código</p>
                    </div>
                    <div class="benefit-item">
                        <h4>💬 Discussão</h4>
                        <p>Debate sobre implementação</p>
                    </div>
                    <div class="benefit-item">
                        <h4>📝 Documentação</h4>
                        <p>Histórico de mudanças</p>
                    </div>
                    <div class="benefit-item">
                        <h4>🧪 Testes</h4>
                        <p>Validação automática</p>
                    </div>
                </div>
            </div>
        `;
    }

    getPRAnatomyContent() {
        return `
            <div class="pr-anatomy">
                <h3>Componentes de um PR</h3>
                <div class="anatomy-items">
                    <div class="anatomy-item">
                        <h4>📋 Título</h4>
                        <p>Descrição concisa da mudança</p>
                    </div>
                    <div class="anatomy-item">
                        <h4>📝 Descrição</h4>
                        <p>Contexto e detalhes da implementação</p>
                    </div>
                    <div class="anatomy-item">
                        <h4>🔍 Arquivos Modificados</h4>
                        <p>Lista de mudanças no código</p>
                    </div>
                    <div class="anatomy-item">
                        <h4>👥 Reviewers</h4>
                        <p>Pessoas responsáveis pela revisão</p>
                    </div>
                    <div class="anatomy-item">
                        <h4>🏷️ Labels</h4>
                        <p>Categorização do PR</p>
                    </div>
                    <div class="anatomy-item">
                        <h4>🎯 Milestone</h4>
                        <p>Associação com versão/sprint</p>
                    </div>
                </div>
            </div>
        `;
    }

    getEffectivePRContent() {
        return `
            <div class="effective-pr">
                <h3>Template de PR Efetivo</h3>
                <div class="pr-template">
                    <pre><code>## 📋 Descrição
Breve descrição das mudanças

## 🎯 Motivação
Por que esta mudança é necessária?

## 🔄 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Documentação
- [ ] Refatoração

## 🧪 Como Testar
Passos para testar as mudanças

## 📸 Screenshots
Se aplicável, adicione capturas de tela

## ✅ Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Testes passando</code></pre>
                </div>
            </div>
        `;
    }

    getCodeReviewContent() {
        return `
            <div class="code-review-process">
                <h3>Processo de Review</h3>
                <div class="review-steps">
                    <div class="step-item">
                        <h4>1. 📖 Ler Descrição</h4>
                        <p>Entender contexto e objetivos</p>
                    </div>
                    <div class="step-item">
                        <h4>2. 🔍 Revisar Código</h4>
                        <p>Analisar lógica e estrutura</p>
                    </div>
                    <div class="step-item">
                        <h4>3. 🧪 Testar Localmente</h4>
                        <p>Verificar funcionamento</p>
                    </div>
                    <div class="step-item">
                        <h4>4. 💬 Comentar</h4>
                        <p>Feedback construtivo</p>
                    </div>
                    <div class="step-item">
                        <h4>5. ✅ Aprovar/Solicitar Mudanças</h4>
                        <p>Decisão final sobre o PR</p>
                    </div>
                </div>
            </div>
        `;
    }

    getReviewBestPracticesContent() {
        return `
            <div class="review-best-practices">
                <h3>Boas Práticas de Review</h3>
                <div class="practice-items">
                    <div class="practice-item">
                        <h4>✅ Seja Construtivo</h4>
                        <p>Critique o código, não a pessoa</p>
                    </div>
                    <div class="practice-item">
                        <h4>✅ Seja Específico</h4>
                        <p>Aponte problemas concretos</p>
                    </div>
                    <div class="practice-item">
                        <h4>✅ Sugira Soluções</h4>
                        <p>Não apenas identifique problemas</p>
                    </div>
                    <div class="practice-item">
                        <h4>✅ Reconheça Bom Código</h4>
                        <p>Elogie implementações elegantes</p>
                    </div>
                    <div class="practice-item">
                        <h4>✅ Seja Oportuno</h4>
                        <p>Revise rapidamente</p>
                    </div>
                </div>
            </div>
        `;
    }

    getCommentTypesContent() {
        return `
            <div class="comment-types">
                <h3>Tipos de Comentários</h3>
                <div class="comment-examples">
                    <div class="comment-item">
                        <h4>💡 Sugestão</h4>
                        <p><em>"Que tal usar um Map aqui para melhor performance?"</em></p>
                    </div>
                    <div class="comment-item">
                        <h4>🐛 Bug</h4>
                        <p><em>"Este código pode causar null pointer exception"</em></p>
                    </div>
                    <div class="comment-item">
                        <h4>❓ Pergunta</h4>
                        <p><em>"Por que não usar a biblioteca padrão aqui?"</em></p>
                    </div>
                    <div class="comment-item">
                        <h4>🎉 Elogio</h4>
                        <p><em>"Excelente solução! Muito limpa e eficiente"</em></p>
                    </div>
                    <div class="comment-item">
                        <h4>🔧 Refatoração</h4>
                        <p><em>"Este método poderia ser quebrado em funções menores"</em></p>
                    </div>
                </div>
            </div>
        `;
    }

    getMergeStrategiesContent() {
        return `
            <div class="merge-strategies">
                <h3>Estratégias de Merge</h3>
                <div class="strategy-comparison">
                    <div class="strategy-item">
                        <h4>🔀 Merge Commit</h4>
                        <p>Preserva histórico completo das branches</p>
                        <code>git merge --no-ff feature-branch</code>
                    </div>
                    <div class="strategy-item">
                        <h4>🔄 Squash and Merge</h4>
                        <p>Agrupa commits em um único commit</p>
                        <code>git merge --squash feature-branch</code>
                    </div>
                    <div class="strategy-item">
                        <h4>📐 Rebase and Merge</h4>
                        <p>Histórico linear, sem merge commits</p>
                        <code>git rebase main && git merge</code>
                    </div>
                </div>
            </div>
        `;
    }

    getExercise4Content() {
        return `
            <div class="exercise">
                <h3>Pull Request Completo (20 minutos)</h3>
                <div class="checklist">
                    <label><input type="checkbox"> Criar branch feature/melhorar-documentacao</label>
                    <label><input type="checkbox"> Fazer mudanças significativas</label>
                    <label><input type="checkbox"> Criar PR com template</label>
                    <label><input type="checkbox"> Atribuir reviewers</label>
                    <label><input type="checkbox"> Simular processo de review</label>
                    <label><input type="checkbox"> Fazer merge com estratégia escolhida</label>
                </div>
            </div>
        `;
    }

    getConflictIntroContent() {
        return `
            <div class="conflict-intro">
                <h3>Causas Comuns de Conflitos</h3>
                <div class="conflict-causes">
                    <div class="cause-item">
                        <h4>📝 Mesma Linha</h4>
                        <p>Duas pessoas modificam a mesma linha</p>
                    </div>
                    <div class="cause-item">
                        <h4>🔄 Renomeação</h4>
                        <p>Arquivo renomeado e modificado</p>
                    </div>
                    <div class="cause-item">
                        <h4>🗑️ Deleção</h4>
                        <p>Arquivo deletado e modificado</p>
                    </div>
                    <div class="cause-item">
                        <h4>🔀 Merge Complexo</h4>
                        <p>Múltiplas branches com mudanças sobrepostas</p>
                    </div>
                </div>
            </div>
        `;
    }

    getIdentifyConflictsContent() {
        return `
            <div class="identify-conflicts">
                <h3>Identificando Conflitos</h3>
                <div class="conflict-signals">
                    <div class="signal-item">
                        <h4>🚨 Mensagem de Erro</h4>
                        <pre><code>CONFLICT (content): Merge conflict in file.js</code></pre>
                    </div>
                    <div class="signal-item">
                        <h4>📊 Git Status</h4>
                        <pre><code>git status
# both modified: file.js</code></pre>
                    </div>
                    <div class="signal-item">
                        <h4>🔍 Git Diff</h4>
                        <pre><code>git diff
# mostra as diferenças</code></pre>
                    </div>
                </div>
            </div>
        `;
    }

    getConflictMarkersContent() {
        return `
            <div class="conflict-markers">
                <h3>Marcadores de Conflito</h3>
                <div class="marker-example">
                    <pre><code>function greeting() {
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
    return "Hello World!";
=======
    return "Olá Mundo!";
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/traducao
}</code></pre>
                </div>
                <div class="marker-explanation">
                    <p><strong>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD:</strong> Código da branch atual</p>
                    <p><strong>=======:</strong> Separador</p>
                    <p><strong>&gt;&gt;&gt;&gt;&gt;&gt;&gt; branch:</strong> Código da branch sendo merged</p>
                </div>
            </div>
        `;
    }

    getResolutionToolsContent() {
        return `
            <div class="resolution-tools">
                <h3>Ferramentas de Resolução</h3>
                <div class="tool-items">
                    <div class="tool-item">
                        <h4>🎯 Git Mergetool</h4>
                        <pre><code>git mergetool</code></pre>
                    </div>
                    <div class="tool-item">
                        <h4>💻 VS Code</h4>
                        <p>Interface visual para resolver conflitos</p>
                    </div>
                    <div class="tool-item">
                        <h4>🔧 Beyond Compare</h4>
                        <p>Ferramenta profissional de merge</p>
                    </div>
                    <div class="tool-item">
                        <h4>✋ Manual</h4>
                        <p>Edição direta no editor de texto</p>
                    </div>
                </div>
            </div>
        `;
    }

    getResolutionStrategiesContent() {
        return `
            <div class="resolution-strategies">
                <h3>Estratégias de Resolução</h3>
                <div class="strategy-steps">
                    <div class="step-item">
                        <h4>1. 📖 Entender o Conflito</h4>
                        <p>Ler código de ambas as sides</p>
                    </div>
                    <div class="step-item">
                        <h4>2. 🤝 Comunicar</h4>
                        <p>Conversar com outros desenvolvedores</p>
                    </div>
                    <div class="step-item">
                        <h4>3. 🔧 Resolver</h4>
                        <p>Combinar ou escolher melhor solução</p>
                    </div>
                    <div class="step-item">
                        <h4>4. 🧪 Testar</h4>
                        <p>Verificar se funciona corretamente</p>
                    </div>
                </div>
            </div>
        `;
    }

    getConflictPreventionContent() {
        return `
            <div class="conflict-prevention">
                <h3>Prevenção de Conflitos</h3>
                <div class="prevention-tips">
                    <div class="tip-item">
                        <h4>🔄 Sync Frequente</h4>
                        <p>Fazer pull regularmente da main</p>
                    </div>
                    <div class="tip-item">
                        <h4>📝 Commits Pequenos</h4>
                        <p>Mudanças menores e mais frequentes</p>
                    </div>
                    <div class="tip-item">
                        <h4>💬 Comunicação</h4>
                        <p>Avisar sobre mudanças em arquivos compartilhados</p>
                    </div>
                    <div class="tip-item">
                        <h4>🏗️ Arquitetura</h4>
                        <p>Código bem estruturado reduz conflitos</p>
                    </div>
                </div>
            </div>
        `;
    }

    getExercise5Content() {
        return `
            <div class="exercise">
                <h3>Simulação de Conflitos (25 minutos)</h3>
                <div class="checklist">
                    <label><input type="checkbox"> Dois participantes modificam mesmo arquivo</label>
                    <label><input type="checkbox"> Primeiro faz push das mudanças</label>
                    <label><input type="checkbox"> Segundo tenta fazer push (falha)</label>
                    <label><input type="checkbox"> Fazer pull e identificar conflitos</label>
                    <label><input type="checkbox"> Resolver conflitos manualmente</label>
                    <label><input type="checkbox"> Commit da resolução e push</label>
                </div>
            </div>
        `;
    }

    // Continue with remaining methods...
    getIssuesContent() {
        return `
            <div class="issues-intro">
                <h3>GitHub Issues</h3>
                <p>Sistema de rastreamento de bugs, features e tarefas</p>
                <div class="issue-features">
                    <div class="feature-item">
                        <h4>🐛 Bug Reports</h4>
                        <p>Relatar e rastrear bugs</p>
                    </div>
                    <div class="feature-item">
                        <h4>✨ Feature Requests</h4>
                        <p>Propor novas funcionalidades</p>
                    </div>
                    <div class="feature-item">
                        <h4>📝 Documentação</h4>
                        <p>Melhorias na documentação</p>
                    </div>
                    <div class="feature-item">
                        <h4>💬 Discussões</h4>
                        <p>Debate sobre implementações</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Add more content methods as needed...
    getSemanticCommitsContent() {
        return `
            <div class="semantic-commits">
                <h3>Conventional Commits</h3>
                <div class="commit-types">
                    <div class="commit-type">
                        <h4>✨ feat:</h4>
                        <p>Nova funcionalidade</p>
                    </div>
                    <div class="commit-type">
                        <h4>🐛 fix:</h4>
                        <p>Correção de bug</p>
                    </div>
                    <div class="commit-type">
                        <h4>📝 docs:</h4>
                        <p>Documentação</p>
                    </div>
                    <div class="commit-type">
                        <h4>🎨 style:</h4>
                        <p>Formatação</p>
                    </div>
                    <div class="commit-type">
                        <h4>♻️ refactor:</h4>
                        <p>Refatoração</p>
                    </div>
                    <div class="commit-type">
                        <h4>🧪 test:</h4>
                        <p>Testes</p>
                    </div>
                </div>
            </div>
        `;
    }

    getFinalSummaryContent() {
        return `
            <div class="final-summary">
                <h3>Resumo do Curso</h3>
                <div class="summary-items">
                    <div class="summary-item">
                        <h4>🤝 Colaboração</h4>
                        <p>Aprendemos a trabalhar em equipe</p>
                    </div>
                    <div class="summary-item">
                        <h4>🌳 Branching</h4>
                        <p>Estratégias para organizar o desenvolvimento</p>
                    </div>
                    <div class="summary-item">
                        <h4>🔄 Pull Requests</h4>
                        <p>Processo de revisão e integração</p>
                    </div>
                    <div class="summary-item">
                        <h4>⚔️ Conflitos</h4>
                        <p>Como identificar e resolver</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Default methods for remaining slides
    getIssueTemplatesContent() {
        return `
            <div class="issue-templates">
                <h3>Padronizando Reports com Templates</h3>
                <div class="template-info">
                    <p>Armazenados em <code>.github/ISSUE_TEMPLATE/*.md</code> ou <code>.github/ISSUE_TEMPLATE.md</code></p>
                    <p>Preenchem automaticamente ao criar nova issue</p>
                </div>
                <div class="template-example">
                    <h4>Exemplo: Bug Report Template</h4>
                    <pre><code>---
name: Bug Report
about: Reporte um bug
title: '[BUG] '
labels: bug
assignees: ''
---

## Descrição do Bug
Descrição clara e concisa do problema.

## Passos para Reproduzir
1. Ir para '...'
2. Clicar em '...'
3. Ver erro

## Comportamento Esperado
O que deveria acontecer.

## Screenshots
Se aplicável, adicione screenshots.
</code></pre>
                </div>
            </div>
        `;
    }
    getLabelsContent() {
        return `
            <div class="labels-system">
                <h3>Categorias Essenciais de Labels</h3>
                <div class="label-categories">
                    <div class="label-category">
                        <h4>🏷️ Tipo</h4>
                        <div class="label-examples">
                            <span class="label bug">bug</span>
                            <span class="label feature">feature</span>
                            <span class="label docs">documentation</span>
                        </div>
                    </div>
                    <div class="label-category">
                        <h4>🔥 Prioridade</h4>
                        <div class="label-examples">
                            <span class="label priority-high">high</span>
                            <span class="label priority-medium">medium</span>
                            <span class="label priority-low">low</span>
                        </div>
                    </div>
                    <div class="label-category">
                        <h4>🚦 Status</h4>
                        <div class="label-examples">
                            <span class="label in-progress">in-progress</span>
                            <span class="label review">review</span>
                            <span class="label blocked">blocked</span>
                        </div>
                    </div>
                    <div class="label-category">
                        <h4>💪 Dificuldade</h4>
                        <div class="label-examples">
                            <span class="label beginner">good-first-issue</span>
                            <span class="label expert">expert</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProjectsContent() {
        return `
            <div class="projects-content">
                <h3>Kanban Board</h3>
                <div class="kanban-board">
                    <div class="kanban-column todo">
                        <h4>📋 To Do</h4>
                        <p>Tarefas planejadas</p>
                    </div>
                    <div class="kanban-column in-progress">
                        <h4>⚙️ In Progress</h4>
                        <p>Em desenvolvimento</p>
                    </div>
                    <div class="kanban-column review">
                        <h4>👀 Review</h4>
                        <p>Aguardando revisão</p>
                    </div>
                    <div class="kanban-column done">
                        <h4>✅ Done</h4>
                        <p>Concluído</p>
                    </div>
                </div>
                <div class="automation-section">
                    <h3>🤖 Automação</h3>
                    <div class="automation-rules">
                        <div class="rule-item">
                            <span class="rule-trigger">Issues Criadas</span>
                            <span class="rule-arrow">→</span>
                            <span class="rule-action">To Do (automático)</span>
                        </div>
                        <div class="rule-item">
                            <span class="rule-trigger">PR Aberto</span>
                            <span class="rule-arrow">→</span>
                            <span class="rule-action">In Progress (automático)</span>
                        </div>
                        <div class="rule-item">
                            <span class="rule-trigger">PR Merged</span>
                            <span class="rule-arrow">→</span>
                            <span class="rule-action">Done (automático)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getMilestonesContent() {
        return `
            <div class="milestones-content">
                <h3>Organização por Objetivos</h3>
                <div class="milestone-types">
                    <div class="milestone-type">
                        <h4>🚀 Releases Específicos</h4>
                        <p>Versões planejadas do software</p>
                    </div>
                    <div class="milestone-type">
                        <h4>🏃 Sprints de Desenvolvimento</h4>
                        <p>Ciclos de trabalho definidos</p>
                    </div>
                    <div class="milestone-type">
                        <h4>🎯 Metas de Projeto</h4>
                        <p>Objetivos estratégicos</p>
                    </div>
                </div>
                
                <h3>Exemplos</h3>
                <div class="milestone-examples">
                    <div class="milestone-example">
                        <span class="milestone-badge">v1.0.0 Release</span>
                        <div class="milestone-progress">
                            <div class="progress-bar" style="width: 85%"></div>
                        </div>
                        <span class="milestone-status">85% concluído</span>
                    </div>
                    <div class="milestone-example">
                        <span class="milestone-badge">Sprint 1 - Autenticação</span>
                        <div class="milestone-progress">
                            <div class="progress-bar" style="width: 100%"></div>
                        </div>
                        <span class="milestone-status">Concluído</span>
                    </div>
                    <div class="milestone-example">
                        <span class="milestone-badge">Q1 2024 Goals</span>
                        <div class="milestone-progress">
                            <div class="progress-bar" style="width: 35%"></div>
                        </div>
                        <span class="milestone-status">35% concluído</span>
                    </div>
                </div>
            </div>
        `;
    }

    getLinkingContent() {
        return `
            <div class="linking-content">
                <h3>Palavras-chave</h3>
                <div class="keywords-examples">
                    <div class="keyword-item">
                        <code>closes #123</code>
                        <p>Fecha a issue quando o PR for mesclado</p>
                    </div>
                    <div class="keyword-item">
                        <code>fixes #123</code>
                        <p>Marca como corrigido após o merge</p>
                    </div>
                    <div class="keyword-item">
                        <code>resolves #123</code>
                        <p>Resolve e fecha a issue</p>
                    </div>
                    <div class="keyword-item">
                        <code>relates to #123</code>
                        <p>Cria referência sem fechar</p>
                    </div>
                </div>
                
                <h3>Benefícios</h3>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <h4>🔄 Fechamento Automático</h4>
                        <p>Issues fechadas ao fazer merge</p>
                    </div>
                    <div class="benefit-item">
                        <h4>🔍 Rastreabilidade</h4>
                        <p>Conexão clara entre código e problema</p>
                    </div>
                    <div class="benefit-item">
                        <h4>📝 Documentação</h4>
                        <p>Registro de decisões e soluções</p>
                    </div>
                </div>
            </div>
        `;
    }
    getExercise6Content() {
        return `
            <div class="exercise">
                <h3>Gestão de Projeto (10 minutos)</h3>
                <div class="checklist">
                    <label><input type="checkbox"> Criar issue com template</label>
                    <label><input type="checkbox"> Adicionar labels apropriados</label>
                    <label><input type="checkbox"> Configurar projeto kanban</label>
                    <label><input type="checkbox"> Criar milestone</label>
                    <label><input type="checkbox"> Linkar PR com issue</label>
                </div>
                <div class="exercise-commands">
                    <h4>Dicas:</h4>
                    <ul>
                        <li>Use palavras-chave como "closes", "fixes", "resolves" seguidas de #issue-number</li>
                        <li>Organize suas colunas como "To Do", "In Progress", "Review", "Done"</li>
                        <li>Crie um milestone para a versão atual do projeto</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getCommitExamplesContent() {
        return `
            <div class="commit-examples">
                <h3>Bons Exemplos:</h3>
                <div class="good-commit">
                    <pre><code>feat(auth): adicionar login com OAuth

Implementa autenticação via Google OAuth 2.0
- Adiciona botão de login
- Configura redirect URI
- Valida tokens JWT

Closes #123</code></pre>
                </div>
                
                <h3>Maus Exemplos:</h3>
                <div class="bad-commits">
                    <div class="bad-commit-examples">
                        <span class="bad-commit">fix stuff</span>
                        <span class="bad-commit">update</span>
                        <span class="bad-commit">changes</span>
                        <span class="bad-commit">wip</span>
                    </div>
                    <p>⚠️ Commits vagos dificultam o entendimento do histórico</p>
                </div>
            </div>
        `;
    }

    getCompleteWorkflowContent() {
        return `
            <div class="workflow-steps">
                <h3>Fluxo Ideal de Desenvolvimento</h3>
                <ol class="workflow-list">
                    <li><strong>Issue criado</strong> - Documentar o problema ou feature</li>
                    <li><strong>Branch criada</strong> - <code>feature/descricao-curta</code></li>
                    <li><strong>Desenvolvimento</strong> - Implementação da solução</li>
                    <li><strong>Commits semânticos</strong> - <code>feat/fix/docs/etc:</code></li>
                    <li><strong>Pull Request</strong> - Descrição completa e links</li>
                    <li><strong>Code Review</strong> - Feedback construtivo</li>
                    <li><strong>Merge</strong> - Integração ao main</li>
                    <li><strong>Deploy</strong> - Entrega ao ambiente</li>
                    <li><strong>Issue fechado</strong> - Ciclo completo</li>
                </ol>
            </div>
        `;
    }

    getActionsContent() {
        return `
            <div class="actions-content">
                <h3>Automação com GitHub Actions</h3>
                <div class="action-example">
                    <h4>Exemplo Básico:</h4>
                    <pre><code>name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test</code></pre>
                </div>
                <div class="actions-usecases">
                    <h4>Casos de Uso Comuns:</h4>
                    <ul>
                        <li>🧪 Execução de testes</li>
                        <li>🔍 Análise de qualidade de código</li>
                        <li>📦 Build e deploy automáticos</li>
                        <li>🤖 Resposta automática a issues</li>
                        <li>📅 Tarefas programadas</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getMetricsContent() {
        return `
            <div class="metrics-content">
                <h3>Indicadores Importantes</h3>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <h4>⏱️ Tempo de Review</h4>
                        <p>Quanto tempo PRs ficam abertos</p>
                    </div>
                    <div class="metric-item">
                        <h4>⚔️ Conflitos</h4>
                        <p>Frequência de conflitos no merge</p>
                    </div>
                    <div class="metric-item">
                        <h4>📊 Frequência de Commits</h4>
                        <p>Ritmo de desenvolvimento</p>
                    </div>
                    <div class="metric-item">
                        <h4>🧪 Cobertura de Testes</h4>
                        <p>Porcentagem de código testado</p>
                    </div>
                </div>
                <div class="tools-section">
                    <h3>Ferramentas:</h3>
                    <ul class="tools-list">
                        <li>GitHub Insights</li>
                        <li>Pull Request Analytics</li>
                        <li>Code Frequency Graphs</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getLearningResourcesContent() {
        return `
            <div class="learning-resources">
                <div class="resource-category">
                    <h3>📚 Documentação</h3>
                    <ul>
                        <li><a href="https://docs.github.com">GitHub Docs</a></li>
                        <li><a href="https://git-scm.com/doc">Git Documentation</a></li>
                        <li><a href="https://www.atlassian.com/git/tutorials">Atlassian Git Tutorials</a></li>
                    </ul>
                </div>
                <div class="resource-category">
                    <h3>🎓 Cursos</h3>
                    <ul>
                        <li>GitHub Learning Lab</li>
                        <li>Pro Git (livro gratuito)</li>
                        <li>Udacity Git Course</li>
                    </ul>
                </div>
                <div class="resource-category">
                    <h3>🛠️ Ferramentas</h3>
                    <ul>
                        <li>Git Kraken</li>
                        <li>GitHub Desktop</li>
                        <li>Visual Studio Code + Git Extensions</li>
                    </ul>
                </div>
            </div>
        `;
    }
    getNextStepsContent() {
        return `
            <div class="next-steps">
                <h3>Para Continuar Aprendendo</h3>
                <div class="steps-grid">
                    <div class="step-item">
                        <h4>🚀 Pratique em projetos pessoais</h4>
                        <p>Aplique os conceitos em seus próprios projetos</p>
                    </div>
                    <div class="step-item">
                        <h4>🌟 Contribua para projetos open source</h4>
                        <p>Experimente o fluxo em projetos reais</p>
                    </div>
                    <div class="step-item">
                        <h4>🤖 Explore GitHub Actions</h4>
                        <p>Automatize seu fluxo de trabalho</p>
                    </div>
                    <div class="step-item">
                        <h4>🔍 Estude Git avançado</h4>
                        <p>Rebase interativo, bisect, reflog</p>
                    </div>
                    <div class="step-item">
                        <h4>👥 Participe de comunidades</h4>
                        <p>Compartilhe conhecimento e aprenda mais</p>
                    </div>
                </div>
            </div>
        `;
    }

    getFinalSummaryContent() {
        return `
            <div class="final-summary">
                <h3>Principais Conceitos</h3>
                <div class="concepts-grid">
                    <div class="concept-item">
                        <h4>🤝 Colaboração efetiva com Git/GitHub</h4>
                    </div>
                    <div class="concept-item">
                        <h4>🌳 Estratégias de branching</h4>
                    </div>
                    <div class="concept-item">
                        <h4>🔄 Pull Requests e Code Review</h4>
                    </div>
                    <div class="concept-item">
                        <h4>⚔️ Resolução de conflitos</h4>
                    </div>
                    <div class="concept-item">
                        <h4>📊 Organização de projetos</h4>
                    </div>
                    <div class="concept-item">
                        <h4>⭐ Boas práticas</h4>
                    </div>
                </div>
                
                <h3>Lembre-se</h3>
                <div class="reminders">
                    <div class="reminder-item">
                        <h4>📝 Commits pequenos e frequentes</h4>
                    </div>
                    <div class="reminder-item">
                        <h4>💬 Comunicação clara</h4>
                    </div>
                    <div class="reminder-item">
                        <h4>🔍 Revisão construtiva</h4>
                    </div>
                    <div class="reminder-item">
                        <h4>📚 Documentação adequada</h4>
                    </div>
                </div>
            </div>
        `;
    }

    getThankYouContent() {
        return `
            <div class="thank-you">
                <h2>Obrigado!</h2>
                <div class="contact-info">
                    <h3>Contato</h3>
                    <div class="contacts-grid">
                        <div class="contact-item">
                            <h4>📧 Email:</h4>
                            <p>Juan e Amanda</p>
                        </div>
                        <div class="contact-item">
                            <h4>🐙 GitHub:</h4>
                            <p>juanfariasdev e Amanda</p>
                        </div>
                        <div class="contact-item">
                            <h4>💼 LinkedIn:</h4>
                            <p>Juan e Amanda</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitPresentationController();
});